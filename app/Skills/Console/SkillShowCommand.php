<?php

declare(strict_types=1);

namespace App\Skills\Console;

use App\Skills\Contracts\SkillReader;
use App\Skills\Exceptions\SkillConflict;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillKeyInvalid;
use App\Skills\Exceptions\SkillMissing;
use App\Skills\Exceptions\SkillSourceInvalid;
use App\Skills\Values\SkillKey;
use Illuminate\Console\Command;
use Illuminate\Contracts\Container\Container;

/**
 * Prints one skill's rendered SKILL.md exactly as a program reads it.
 */
final class SkillShowCommand extends Command
{
    protected $signature = 'skill:show {key : The key of the skill} {--json : Print the skill and its digest as JSON}';

    protected $description = 'Show the rendered text of a skill';

    public function handle(Container $container): int
    {
        try {
            $skill = $container->make(SkillReader::class)->find(SkillKey::from((string) $this->argument('key')));
        } catch (SkillKeyInvalid|SkillMissing|SkillSourceInvalid|SkillConflict|SkillDeclarationInvalid $failure) {
            $this->error($failure->getMessage());

            return self::FAILURE;
        }

        if ($this->option('json')) {
            $this->line(json_encode(['key' => $skill->key->key, 'owner' => $skill->owner, 'source' => $skill->origin->value, 'digest' => $skill->rendered->digest, 'markdown' => $skill->rendered->markdown], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $this->output->write($skill->rendered->markdown);

        return self::SUCCESS;
    }
}
