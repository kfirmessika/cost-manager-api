# api_test_extended.py
# ─────────────────────────────────────────────────────────────────────────────
# Extended test script for Cost Manager RESTful Web Services.
# Covers: /api/about, /api/users, /api/add, /api/report
# Writes all output to a file whose name is prompted from the user.

import sys
import requests

# Prompt for the output filename:
filename = input("filename=")

# Base URL of the running server (adjust if needed):
line = "http://localhost:3000"

# Redirect all prints to the output file:
output = open(filename, "w")
sys.stdout = output

print(line)
print()

# ─── TEST 1: GET /api/about ────────────────────────────────────────────────────
print("testing GET /api/about")
print("-------------------------")
try:
    url = line + "/api/about/"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 2: GET /api/users (all users) ─────────────────────────────────────────
print("testing GET /api/users (all users)")
print("----------------------------------")
try:
    url = line + "/api/users"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 3: GET /api/users/123123 (specific user) ───────────────────────────────
print("testing GET /api/users/123123")
print("--------------------------------")
try:
    url = line + "/api/users/123123"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 4: GET /api/report BEFORE adding cost ─────────────────────────────────
print("testing GET /api/report (before adding cost)")
print("---------------------------------------------")
try:
    url = line + "/api/report/?id=123123&year=2025&month=2"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 5: POST /api/add with nonexistent user ─────────────────────────────────
print("testing POST /api/add (nonexistent user id=999999)")
print("--------------------------------------------------")
try:
    url = line + "/api/add/"
    payload = {
        'userid':      999999,
        'description': 'test-nonexistent',
        'category':    'food',
        'sum':         10,
        'date':        '2025-02-15'
    }
    data = requests.post(url, json=payload)
    print("url=" + url)
    print("payload=" + str(payload))
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 6: POST /api/users to create user 123123 (if not already present) ─────
print("testing POST /api/users (create user 123123)")
print("---------------------------------------------")
try:
    url = line + "/api/users"
    payload = {
        'id':             123123,
        'first_name':    'mosh',
        'last_name':     'israeli',
        'birthday':      '1990-01-01',
        'marital_status':'single'
    }
    data = requests.post(url, json=payload)
    print("url=" + url)
    print("payload=" + str(payload))
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 7: GET /api/users/123123 (verify creation) ─────────────────────────────
print("testing GET /api/users/123123 (verify creation)")
print("------------------------------------------------")
try:
    url = line + "/api/users/123123"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 8: POST /api/add for user 123123 (add a February cost) ──────────────────
print("testing POST /api/add (existing user 123123, date in Feb 2025)")
print("----------------------------------------------------------------")
try:
    url = line + "/api/add/"
    payload = {
        'userid':      123123,
        'description': 'coffee',
        'category':    'food',
        'sum':         5,
        'date':        '2025-02-15'
    }
    data = requests.post(url, json=payload)
    print("url=" + url)
    print("payload=" + str(payload))
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 9: GET /api/users/123123 (verify total updated) ─────────────────────────
print("testing GET /api/users/123123 (verify total updated)")
print("------------------------------------------------------")
try:
    url = line + "/api/users/123123"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 10: GET /api/report AFTER adding cost ──────────────────────────────────
print("testing GET /api/report (after adding cost)")
print("-------------------------------------------")
try:
    url = line + "/api/report/?id=123123&year=2025&month=2"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 11: POST /api/users to create a NEW user 555555 ─────────────────────────
print("testing POST /api/users (create user 555555)")
print("---------------------------------------------")
try:
    url = line + "/api/users"
    payload = {
        'id':             555555,
        'first_name':    'Alice',
        'last_name':     'Johnson',
        'birthday':      '1995-07-21',
        'marital_status':'married'
    }
    data = requests.post(url, json=payload)
    print("url=" + url)
    print("payload=" + str(payload))
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 12: GET /api/users/555555 (verify new user) ─────────────────────────────
print("testing GET /api/users/555555 (verify new user)")
print("------------------------------------------------")
try:
    url = line + "/api/users/555555"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 13: POST /api/users with duplicate ID 123123 ───────────────────────────
print("testing POST /api/users (duplicate ID 123123)")
print("----------------------------------------------")
try:
    url = line + "/api/users"
    payload = {
        'id':             123123,
        'first_name':    'Bob',
        'last_name':     'Smith',
        'birthday':      '1980-05-05',
        'marital_status':'single'
    }
    data = requests.post(url, json=payload)
    print("url=" + url)
    print("payload=" + str(payload))
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 14: POST /api/add for user 555555 (add a March cost) ───────────────────
print("testing POST /api/add (existing user 555555, date in Mar 2025)")
print("----------------------------------------------------------------")
try:
    url = line + "/api/add/"
    payload = {
        'userid':      555555,
        'description': 'textbook',
        'category':    'education',
        'sum':         82,
        'date':        '2025-03-10'
    }
    data = requests.post(url, json=payload)
    print("url=" + url)
    print("payload=" + str(payload))
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 15: GET /api/users/555555 (verify total updated) ───────────────────────
print("testing GET /api/users/555555 (verify total updated)")
print("------------------------------------------------------")
try:
    url = line + "/api/users/555555"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# ─── TEST 16: GET /api/report for user 555555 ────────────────────────────────────
print("testing GET /api/report (user 555555, year=2025, month=3)")
print("---------------------------------------------------------")
try:
    url = line + "/api/report/?id=555555&year=2025&month=3"
    data = requests.get(url)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)
    try:
        print("data.json()=" + str(data.json()))
    except Exception as e_json:
        print("json parse error:", e_json)
except Exception as e:
    print("problem")
    print(e)
print("")
print()

# Close output file
output.close()
