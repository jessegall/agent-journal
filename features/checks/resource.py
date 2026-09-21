from resources.base import PROJECT, USER, Resource
from resources.shapes import NUMBER, TEXT, Field, Shape


class Check(Shape, Resource):
    type = "check"
    icon = "check"
    scope = PROJECT
    title_ = "Check"
    abstract_ = "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes"
    help_ = "A check names the command it runs from the project root and how often; exit 0 passes, anything else fails and its output says why. journal check run <n> runs one, journal check sweep runs every check."
    names = {"complete": "retire"}
    notify = (USER,)
    command = Field(TEXT)
    every = Field(NUMBER, default=0)
    last = Field(default=dict)
    running = Field(default=dict)
    runs = Field(default=list)
    view = "check"
