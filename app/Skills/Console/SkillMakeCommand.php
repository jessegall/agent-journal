<?php

declare(strict_types=1);

namespace App\Skills\Console;

use App\Bus\Contracts\CommandBus;
use App\Skills\Commands\CreateSkill;
use App\Skills\Console\Concerns\PrintsSkillRefusals;
use App\Skills\Console\Concerns\ReadsAudienceOptions;
use App\Skills\Support\SkillConsole;
use App\Skills\Values\SkillDraft;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * Stores a new skill under a user- key from a Markdown body, as the journal's owner. The request id is printed first,
 * so a retry can send it again.
 */
final class SkillMakeCommand extends Command
{
    use PrintsSkillRefusals, ReadsAudienceOptions;

    protected $signature = 'skill:make {key : A new user- key} {--name= : The display name, the key unless given} {--description= : What the skill is for} {--body=- : The Markdown body, - to read it from standard input} {--conditions= : The condition as JSON} {--profile=* : Profile keys} {--type=* : Profile types} {--program=* : Program keys} {--provider=* : Provider keys} {--main-agent : Only the main agent} {--request-id= : Send again under the id a failed attempt printed}';

    protected $description = 'Store a new skill';

    public function handle(SkillConsole $console, CommandBus $commands): int
    {
        $requestId = (string) ($this->option('request-id') ?? Str::ulid());
        $this->line("Request id: {$requestId}");

        return $this->printRefusals(function () use ($console, $commands, $requestId) {
            $console->actAsOwner();
            $key = (string) $this->argument('key');
            $draft = new SkillDraft(
                (string) ($this->option('name') ?? $key),
                (string) $this->option('description'),
                $console->sectionsOf($console->bodyOf((string) $this->option('body'))),
                $console->conditionOf($this->conditionsOption(), $this->audience(), (bool) $this->option('main-agent')),
            );

            return $console->savedLines($commands->run(new CreateSkill($key, $requestId, $draft)));
        });
    }
}
