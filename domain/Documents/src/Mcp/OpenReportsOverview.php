<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Contracts\OverviewContribution;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\OverviewSection;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Enums\AttentionFilter;

final readonly class OpenReportsOverview implements OverviewContribution
{
    public function __construct(private ReportResolver $reports) {}

    public function section(): string
    {
        return 'reports';
    }

    public function read(): OverviewSection
    {
        return OverviewSection::from([
            'title' => 'Open reports',
            'counts' => ['open' => $this->reports->openCount()],
            'nextAction' => new NextAction('reports_list', ['state' => AttentionFilter::Active->value]),
        ]);
    }
}
