from core.modules.processes.migrations.m054_vitest_listing_counts import VitestListingCountsMigration


class VitestSummaryCountsMigration(VitestListingCountsMigration):
    """Updates the stock vitest reader to read the total on vitest's own Tests line as well as the listing count."""

    number = 55
