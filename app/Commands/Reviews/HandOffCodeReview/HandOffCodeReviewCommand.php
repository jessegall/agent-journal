<?php

declare(strict_types=1);

namespace App\Commands\Reviews\HandOffCodeReview;

use App\Attributes\Entry;
use App\Attributes\RepeatableRead;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Hands certified work that must be reviewed to its reviewer: imports its commits under their protected ref, then
 * opens one review ask on the worker's review route. The engine runs it for each reserved work whose review is not
 * open yet, so a lost certification event still leads to one import and one ask; a failed import waits for the
 * next pass with its reason.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class HandOffCodeReviewCommand extends Command
{
    /**
     * The maintenance capability the engine grants for handing off reviews.
     */
    public const string MAINTENANCE_SCOPE = 'supervision.review';

    public function __construct(public string $certificate) {}
}
