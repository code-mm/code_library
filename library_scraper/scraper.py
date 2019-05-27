import bs4
import requests
import json

print("Please enter the book you are looking for:")
bookname = input()

json = requests.get("https://www.googleapis.com/books/v1/volumes?q={}&order_by=relevance".format(bookname.replace(" ", "+")))
results = json.load(json.text)

print(results)