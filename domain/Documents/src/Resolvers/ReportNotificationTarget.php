<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Actors\Contracts\ActorLabels;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\NotificationTargetResolver;
use App\Communication\Data\NotificationLink;
use App\Ui\Contracts\DeclaredPages;
use Domain\Documents\Models\Report;
use PhpOption\Option;

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

    /**
     * @return Option<NotificationLink>
     */
    public function linkFor(string $targetId): Option
    {
        if (! ctype_digit($targetId)) {
            return Option::fromValue(null);
        }

        return Option::fromValue(Report::query()->sharedPublished()->where('number', (int) $targetId)->first())
            ->map(fn (Report $report) => new NotificationLink(
                $this->titleOf($report),
                $this->pages->addressOf(self::REPORT_PAGE, ['report' => (string) $report->number]),
            ));
    }

    public function disclosesMissing(): bool
    {
        return false;
    }

    private function titleOf(Report $report): string
    {
        $filer = new ActorIdentity($report->creator_type, $report->creator_id);
        $name = $this->labels->labelsFor([$filer])->nameOf($filer);

        return $name === null ? $report->title : "{$report->title}, from {$name}";
    }
}
