<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Skills\SkillPublishingService;
use Illuminate\Console\Command;

/**
 * The daily cleanup: removes staged skill folders no target uses and retires old publications; a folder with a
 * hand-edited file is kept and named.
 */
final class SkillPruneCommand extends Command
{
    protected $signature = 'skill:prune';

    protected $description = 'Remove unused staged skill folders and retire old publications';

    public function handle(SkillPublishingService $publishing): int
    {
        $pruned = $publishing->prune();
        $this->line("Retired {$pruned->retired} publications.");

        foreach ($pruned->conflicts as $conflict) {
            $this->warn($conflict);
        }

        return self::SUCCESS;
    }
}
