<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\CopySkill\CopySkillCommand;
use App\Console\Concerns\PrintsSkillRefusals;
use App\Contracts\CommandBus;
use App\Support\SkillAuthoring;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * Copies a skill you may read, shipped or stored, into a new stored skill under a user- key.
 */
final class SkillCopyCommand extends Command
{
    use PrintsSkillRefusals;

    protected $signature = 'skill:copy {key : The skill to copy} {new-key : A new user- key} {--request-id= : Send again under the id a failed attempt printed}';

    protected $description = 'Copy a skill into a new stored skill';

    public function handle(SkillAuthoring $console, CommandBus $commands): int
    {
        $requestId = (string) ($this->option('request-id') ?? Str::ulid());
        $this->line("Request id: {$requestId}");

        return $this->printRefusals(function () use ($console, $commands, $requestId) {
            $console->actAsOwner();

            return $console->savedLines(
                $commands->run(
                    new CopySkillCommand((string) $this->argument('key'), (string) $this->argument('new-key'), $requestId),
                ),
            );
        });
    }
}
