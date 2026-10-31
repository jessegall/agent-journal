from core.base.module.module import Module
from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_reference import SettingReference
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

PATH = "tests.stories.core.base.setting.support.setting_samples"
TUNNEL = SettingGroup("tunnel", "Tunnel", "How a phone reaches this computer from outside.", toggleable=True, children=[
    SettingValue("address", "Address", "The address of the tunnel service.", SettingType.TEXT, default="https://tunnel.example.com", scope=SettingScope.PROJECT),
    SettingValue("token", "Token", "The token the tunnel service gave you.", SettingType.TEXT, secret=True, scope=SettingScope.PROJECT),
])


class GoodModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    settings = [SettingValue("limit", "Limit", "How many rows a list shows at once.", SettingType.NUMBER, default=50, agent_writable=True),
                SettingGroup("sharing", "Sharing", "Links that show one row to someone outside.", children=[TUNNEL])]


class TwiceModule(Module):
    name = "twice"
    requires_core = ">=5,<6"
    settings = [SettingValue("limit", "Limit", "How many rows a list shows.", SettingType.NUMBER, default=50),
                SettingValue("limit", "Limit", "How many rows a list shows.", SettingType.NUMBER, default=60)]


class WrongDefaultModule(Module):
    name = "wrong"
    requires_core = ">=5,<6"
    settings = [SettingValue("limit", "Limit", "How many rows a list shows.", SettingType.NUMBER, default="fifty")]


class EmptyGroupModule(Module):
    name = "empty"
    requires_core = ">=5,<6"
    settings = [SettingGroup("sharing", "Sharing", "Links that show one row to someone outside.", children=[])]


class LongTitleModule(Module):
    name = "long"
    requires_core = ">=5,<6"
    settings = [SettingValue("limit", "How many rows a list shows at once on one page", "How many rows a list shows.", SettingType.NUMBER, default=50)]


class LongDescriptionModule(Module):
    name = "wordy"
    requires_core = ">=5,<6"
    settings = [SettingValue("limit", "Limit", "How many rows a list shows at once, before it offers the next page of rows to the person who reads it on a screen or a phone.",
                             SettingType.NUMBER, default=50)]


class SecretDefaultModule(Module):
    name = "leaky"
    requires_core = ">=5,<6"
    settings = [SettingValue("token", "Token", "The token the service gave you.", SettingType.TEXT, default="abc123", secret=True)]


class RemoteModule(Module):
    name = "remote"
    requires_core = ">=5,<6"
    settings = [SettingGroup("access", "Access", "How you reach this computer from outside.", children=[SettingReference("good.sharing.tunnel")])]


class DanglingModule(Module):
    name = "dangling"
    requires_core = ">=5,<6"
    settings = [SettingGroup("access", "Access", "How you reach this computer from outside.", children=[SettingReference("good.sharing.nothing")])]


class LoopModule(Module):
    name = "loop"
    requires_core = ">=5,<6"
    settings = [SettingGroup("again", "Again", "A group that holds itself.", children=[SettingReference("loop.again")])]


class OpenModule(Module):
    name = "open"
    requires_core = ">=5,<6"
    settings = [SettingGroup("color", "Colours", "The colour each kind of agent is drawn in.",
                             any_key=SettingValue("*", "Colour", "The colour this kind of agent is drawn in.", SettingType.TEXT, default="grey", scope=SettingScope.PROJECT))]
