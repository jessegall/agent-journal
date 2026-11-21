<?php

declare(strict_types=1);

namespace App\Processes\Resolvers;

use App\Communication\Contracts\NotificationTargetResolver;
use App\Communication\Data\NotificationLink;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\RunOutcome;
use App\Processes\Support\ProjectKey;
use App\Ui\Contracts\DeclaredPages;
use PhpOption\Option;

/**
 * A run outcome notification leads to the run's own page while the existing actor-and-project policy lets the reader
 * see the run: its title is the attempt's current result, so a corrected result shows on the same receipt.
 */
final readonly class RunNotificationTarget implements NotificationTargetResolver
{
    public const string KEY = 'run';

    private const string RUN_PAGE = 'processes.run';

    public function __construct(
        private ProjectKey $projects,
        private DeclaredPages $pages,
    ) {}

    /**
     * @return Option<NotificationLink>
     */
    public function linkFor(string $targetId): Option
    {
        $run = ProcessRun::query()
            ->forActor()
            ->where('project_key', $this->projects->current())
            ->whereKey($targetId)
            ->first();

        return Option::fromValue($run)->flatMap(fn (ProcessRun $visible) => $this->linkOf($visible));
    }

    public function disclosesMissing(): bool
    {
        return false;
    }

    /**
     * @return Option<NotificationLink>
     */
    private function linkOf(ProcessRun $run): Option
    {
        return RunOutcome::ofRun($run)->map(fn (RunOutcome $outcome) => new NotificationLink(
            $outcome->result->summaryFor($run->plan),
            $this->pages->addressOf(self::RUN_PAGE, ['run' => $run->id]),
        ));
    }
}
