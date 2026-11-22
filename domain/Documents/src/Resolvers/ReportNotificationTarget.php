<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Actors\Contracts\ActorLabels;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\NotificationTargetResolver;
use App\Communication\Data\NotificationLink;
use App\Ui\Contracts\DeclaredPages;
use Domain\Documents\Models\Report;

/**
 * A report-ready notification leads to the report's own page while the reader may read the report: its title as
 * plain text with the name of the helper that filed it. A report out of sight is never named.
 */
final readonly class ReportNotificationTarget implements NotificationTargetResolver
{
    public const string KEY = 'report';

    private const string REPORT_PAGE = 'documents.report';

    public function __construct(
        private DeclaredPages $pages,
        private ActorLabels $labels,
    ) {}

    public function linksFor(array $targetIds): array
    {
        $numbers = array_map(intval(...), array_values(array_filter($targetIds, ctype_digit(...))));
        $reports = Report::query()->sharedPublished()->whereIn('number', $numbers)->readExactly(count($numbers))->get();
        $filers = $this->labels->labelsFor(
            array_values($reports->map(fn (Report $report) => new ActorIdentity($report->creator_type, $report->creator_id))->all()),
        );
        $links = [];

        foreach ($reports as $report) {
            $name = $filers->nameOf(new ActorIdentity($report->creator_type, $report->creator_id));
            $links[(string) $report->number] = new NotificationLink(
                $name === null ? $report->title : "{$report->title}, from {$name}",
                $this->pages->addressOf(self::REPORT_PAGE, ['report' => (string) $report->number]),
            );
        }

        return $links;
    }

    public function disclosesMissing(): bool
    {
        return false;
    }
}
