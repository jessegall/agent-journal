<?php

declare(strict_types=1);

namespace App\Casts;

use App\Data\Skills\StoredSkillSection;
use App\Values\SkillSection;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * A stored revision's sections: written as a JSON list of key, heading and literal Markdown, read as text sections.
 *
 * @implements CastsAttributes<list<SkillSection>, list<SkillSection>>
 */
final class SkillSectionsCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     * @return list<SkillSection>
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): array
    {
        return array_values(array_map(
            fn (StoredSkillSection $section) => $section->section(),
            StoredSkillSection::collect(json_decode((string) $value, true, flags: JSON_THROW_ON_ERROR)),
        ));
    }

    /**
     * @param  list<SkillSection>  $value
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return json_encode(
            array_map(
                fn (SkillSection $section) => [
                    'key' => $section->key,
                    'heading' => $section->heading,
                    'markdown' => $section->content,
                ],
                $value,
            ),
            JSON_THROW_ON_ERROR,
        );
    }
}
