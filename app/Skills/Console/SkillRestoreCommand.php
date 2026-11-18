<?php

declare(strict_types=1);

namespace App\Skills\Console;

use App\Bus\Contracts\CommandBus;
use App\Skills\Commands\RestoreSkill;
use App\Skills\Console\Concerns\PrintsSkillRefusals;
use App\Skills\Support\SkillAuthoring;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * Saves an earlier revision's content as a new revision of a stored skill.
 */
final class SkillRestoreCommand extends Command
{
    use PrintsSkillRefusals;

    protected $signature = 'skill:restore {number : The skill number or key} {--revision= : The revision to restore} {--expected-revision= : The revision you read} {--request-id= : Send again under the id a failed attempt printed}';

    protected $description = 'Restore an earlier revision of a stored skill';

    public function handle(SkillAuthoring $console, CommandBus $commands): int
    {
        $requestId = (string) ($this->option('request-id') ?? Str::ulid());
        $this->line("Request id: {$requestId}");

        return $this->printRefusals(function () use ($console, $commands, $requestId) {
            $console->actAsOwner();
            $skill = $console->stored((string) $this->argument('number'));

            return $console->savedLines($commands->run(new RestoreSkill($skill->id, (int) $this->option('revision'), (int) $this->option('expected-revision'), $requestId)));
        });
    }
}
