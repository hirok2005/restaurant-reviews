import json
import time

def createIDs():
    with open("./data.json", "r") as f:
        js = json.load(f)
    print(js["restaurants"])
    for i in range(len(js["restaurants"])):
        js["restaurants"][i]["id"] = "".join(js["restaurants"][i]["name"].split())[:5] + str(int(time.time()) % 10000000)
    with open("./data.json", "wt") as f:
        json.dump(js, f, indent=4)

if __name__ == "__main__":
    createIDs()