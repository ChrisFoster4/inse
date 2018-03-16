from helium.api import *
import time

#Need Google Chrome installed to run these tests

# start_chrome("google.com/?hl=en")
# write("Helium")
# press(ENTER)
# click("Helium - Wikipedia")
# if 'Wikipedia' in get_driver().title:
# 	print('Test passed!')
# else:
# 	print('Test failed :(')
# kill_browser()

#Utility Functions
def delay(seconds):
    time.sleep(seconds)

#Test Functions
#Start of login test
def programLoad():
    if S("#originLang").exists():
        print("-programLoad passed!")
    else:
        print("-programLoad failed!")

def inputText():
    write("Hello")
    if TextField("#inputArea").value == "Hello":
        print("-inputText passed!")
    else:
        print("-inputText failed!")

def changeInputLang():
    select(ComboBox("#originLang"), "English")
    if ComboBox("#originLang").value == "English":
        print("-changeInputLang passed!")
    else:
        print("-changeInputLang failed!")

def changeOutputLang():
    select(ComboBox("#targetLang"), "German")
    if ComboBox("#originLang").value == "German":
        print("-changeOutputLang passed!")
    else:
        print("-changeutputLang failed!")

def submitTranslation():
    click(Button("#translateButton"))
    if TextField("#outputArea").value == "Hallo":
        print("-submitTranslation passed!")
    else:
        print("-submitTranslation failed!")

def main():
    start_chrome("http://localhost:8080/")
    delay(1)
    programLoad()
    delay(1)
    inputText()
    delay(1)
    changeInputLang()
    delay(1)
    changeOutputLang()
    delay(1)
    submitTranslation()
    print("END OF TESTS")

main()
