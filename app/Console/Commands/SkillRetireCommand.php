<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\Skills\RetireSkill\RetireSkillCommand;
use App\Console\Concerns\NamesStoredSkill;
use App\Console\Concerns\PrintsSkillRefusals;
use App\Contracts\Bus\CommandBus;
use App\Models\Skills\Skill;
use App\Support\SkillAuthoringService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * Retires a stored skill you own; its revisions stay readable.
 */
final class SkillRetireCommand extends Command
{
    use NamesStoredSkill;
    use PrintsSkillRefusals;

    protected $signature = 'skill:retire {number : The skill number or key} {--expected-revision= : The revision you read} {--request-id= : Send again under the id a failed attempt printed}';

    protected $description = 'Retire a stored skill';

    public function handle(SkillAuthoringService $console, CommandBus $commands): int
    {
        $requestId = (string) ($this->option('request-id') ?? Str::ulid());
        $this->line("Request id: {$requestId}");

        return $this->printRefusals(function () use ($console, $commands, $requestId) {
            $console->actAsOwner();
            $skill = $console->storedSkill($this->skillNumber());

            $retiredSkill = $commands->run(new RetireSkillCommand(
                $skill->id,
                (int) $this->option('expected-revision'),
                $requestId,
            ));

            return [
                "Skill {$retiredSkill->number} ({$skill->key}) is retired.",
                ...$console->statusLines(Skill::query()->whereKey($skill->id)->firstOrFail()),
            ];
        });
    }
}
