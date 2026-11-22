<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Contracts\Skills\SkillResolver;
use App\Exceptions\SkillConflict;
use App\Exceptions\SkillDeclarationInvalid;
use App\Exceptions\SkillKeyInvalid;
use App\Exceptions\SkillMissing;
use App\Exceptions\SkillSourceInvalid;
use App\Values\SkillKey;
use Illuminate\Console\Command;

/**
 * Prints one skill's rendered SKILL.md exactly as a driver reads it.
 */
final class SkillShowCommand extends Command
{
    protected $signature = 'skill:show {key : The key of the skill} {--json : Print the skill and its digest as JSON}';

    protected $description = 'Show the rendered text of a skill';

    public function handle(SkillResolver $skills): int
    {
        try {
            $skill = $skills->find(SkillKey::from((string) $this->argument('key')));
        } catch (SkillKeyInvalid|SkillMissing|SkillSourceInvalid|SkillConflict|SkillDeclarationInvalid $failure) {
            $this->error($failure->getMessage());

            return self::FAILURE;
        }

        if ($this->option('json')) {
            $this->line(
                json_encode(
                    [
                        'key' => $skill->key->key,
                        'owner' => $skill->owner,
                        'source' => $skill->origin->value,
                        'digest' => $skill->rendered->digest,
                        'markdown' => $skill->rendered->markdown,
                    ],
                    JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES,
                ),
            );

            return self::SUCCESS;
        }

        $this->output->write($skill->rendered->markdown);

        return self::SUCCESS;
    }
}
