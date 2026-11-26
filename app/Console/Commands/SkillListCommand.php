<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Contracts\Skills\SkillResolver;
use App\Exceptions\SkillConflict;
use App\Exceptions\SkillDeclarationInvalid;
use App\Exceptions\SkillSourceInvalid;
use App\Values\SkillEntry;
use Illuminate\Console\Command;

/**
 * Lists the skill catalogue: each skill's key, name, owner, origin, current revision of a stored skill and digest, or
 * why the catalogue cannot be built.
 */
final class SkillListCommand extends Command
{
    protected $signature = 'skill:list {--json : Print the list as JSON}';

    protected $description = 'List the skills of the catalogue';

    public function handle(SkillResolver $resolver): int
    {
        try {
            $skills = $resolver->all();
        } catch (SkillSourceInvalid|SkillConflict|SkillDeclarationInvalid $failure) {
            $this->error($failure->getMessage());

            return self::FAILURE;
        }

        $rows = array_map(
            fn (SkillEntry $skill) => [
                'key' => $skill->key->key,
                'name' => $skill->name,
                'owner' => $skill->owner,
                'source' => $skill->origin->value,
                'revision' => $skill->revision,
                'digest' => $skill->rendered->digest,
            ],
            $skills,
        );

        if ($this->option('json')) {
            $this->line(json_encode($rows, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $this->table(['Key', 'Name', 'Owner', 'Source', 'Revision', 'Digest'], array_map(array_values(...), $rows));

        return self::SUCCESS;
    }
}
