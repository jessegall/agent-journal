from features.base import FeatureDetails


class DesignsDetails(FeatureDetails):
    name = "designs"
    title = "Designs"
    abstract = "A design document that always reads as it stands now, with every earlier revision kept and readable"
    help = ("journal design create \"<name>\" starts one; every edit after it (design section, design cut, design update) copies the latest revision "
            "and changes the copy, so nothing is lost. The viewer shows the design as it stands, a row of its revisions to scroll back through, "
            "and what each revision changed. The revisions are documents underneath, kept out of the doc list and search: they are read through their design.")
