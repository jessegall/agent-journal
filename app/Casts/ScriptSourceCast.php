<?php

declare(strict_types=1);

namespace App\Casts;

use App\Values\ScriptSource;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * A profile revision's script as its ScriptSource: the text in the script_source column and its named commands,
 * by key, in the script_commands column, which its own array cast reads.
 *
 * @implements CastsAttributes<ScriptSource, ScriptSource>
 */
final class ScriptSourceCast implements CastsAttributes
{
    private const string COMMANDS_COLUMN = 'script_commands';

    /**
     * @param  string  $value
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): ScriptSource
    {
        return ScriptSource::fromDefinitions($value, $model->getAttribute(self::COMMANDS_COLUMN));
    }

    /**
     * @param  ScriptSource  $value
     * @param  array<string, mixed>  $attributes
     * @return array<string, string>
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        return [
            $key => $value->text,
            self::COMMANDS_COLUMN => json_encode($value->definitions(), JSON_THROW_ON_ERROR),
        ];
    }
}
