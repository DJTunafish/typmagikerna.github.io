#!/usr/bin/python3

import os
import re
import json


class News:
    def __init__(self, date=None, text=None, title=None, image=None, links=None):
        # Do sanity checks
        if title != None:
            # Titles are strings with positive length
            if not isinstance(title, str):
                raise ValueError("Title was supplied, but it was not in "
                                 "proper format. Here it is: " + str(title))

            # 0 length title is no title.
            if len(title) == 0:
                title = None

        self.title = title


        if date != None:
            pass # TODO: sanity checks
        self.date = date

        if image != None:
            pass # TODO: sanity check
        self.image = image

        if links != None:
            pass # TODO: sanity check
        self.links = links

        if text == None:
            raise ValueError("Every news must have some text")
        # TODO: sanity check on text
        self.text = text

    def __str__(self):
        return "\n".join(["== News Post ==",
                "Title: " + self.title,
                "Date: " + str(self.date),
                "Image: " + str(self.image),
                "Links: " + str(self.links),
                "Text: ",
                str(self.text),
                "==============="])

    def fromRaw(raw):

        # Splits raw text into head and body
        # raw_split_head_body : String -> ([String], String)
        def raw_split_head_body(raw):
            # Compiling regex because we need to check for empty lines many times
            re_emptyline = re.compile('^\s*$')
            lines = raw.splitlines()

            for (index, line) in enumerate(lines):
                # Is this line empty?
                if re_emptyline.match(line) != None:
                    # If it is, return the split.
                    return (lines[0:index], "\n".join(lines[index+1:]))

            raise ValueError("Could not find an empty line dividing metatags and body.")

        # Parse a line of the form "[title](href) [title2](href2) ..." into
        # a dict
        def parseLinks(links):
            res = []
            matches = re.findall("\[([^\]]+)\]\(([^\)]+)\)", links)
            for (title, href) in matches:
                res.append({"title": title, "href": href})

            return res

        def markdown_to_html(raw):
            raw = re.sub("\[([^\]]+)\]\(([^\)]+)\)",
                         lambda m: "<a href='" + m.group(2) + "'>" + m.group(1) + "</a>",
                         raw)
            raw = re.sub("\*([^\*]+)\*",
                        lambda m: "<strong>" + m.group(1) + "</strong>",
                        raw)

            return raw;

        title = None
        date = None
        image = None
        links = None
        text = None

        (head, body) = raw_split_head_body(raw)

        for line in head:
            if line[0:7] == "title: ":
                title = line[7:]

            if line[0:6] == "date: ":
                date = line[6:]

            if line[0:7] == "image: ":
                image = line[7:]

            if line[0:7] == "links: ":
                links = parseLinks(line[7:])

        return News(date=date, text=markdown_to_html(body), title=title, image=image, links=links)

    def serializable(self):
        res = {}

        res["text"] = self.text

        if self.date != None:
            res["date"] = self.date

        if self.title != None:
            res["title"] = self.title

        if self.links != None:
            res["links"] = self.links

        if self.image != None:
            res["image"] = self.image

        return res





def raw_news():
    res = []
    for newsbit in os.listdir("news"):
        f = open(os.path.join("news", newsbit), "r")
        res.append(f.read())
        f.close()

    return res

def main():
    raws = raw_news()
    news = []
    print("Found " + str(len(raws)) + " bits of news, parsing...")
    for raw in raw_news():
        try:
            news.append(News.fromRaw(raw))
        except ValueError as e:
            print("Error: " + str(e))
    print("Done.")

    print("Compiling to JSON...")
    res = []
    for n in news:
        res.append(n.serializable())

    print("Writing to news/news.json...")
    with open(os.path.join("news", "news.json"), "w") as f:
        f.write(json.dumps(res))

    print("Done.")

if __name__ == "__main__":
    main()
