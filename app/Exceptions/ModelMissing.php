<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Exceptions\Concerns\ThrowsLater;
use Illuminate\Database\Eloquent\Model;
use RuntimeException;

/**
 * A row a model looked up by its key is not there, or the global scopes hide it from the current actor. It knows
 * nothing of commands: the bus turns it into a refusal.
 */
final class ModelMissing extends RuntimeException
{
    /** @use ThrowsLater<ModelMissing> */
    use ThrowsLater;

    /**
     * @param  class-string<Model>  $model
     */
    private function __construct(public readonly string $model, public readonly string $id)
    {
        parent::__construct("{$model} {$id} is not there.");
    }

    /**
     * @param  class-string<Model>  $model
     */
    public static function for(string $model, string $id): self
    {
        return new self($model, $id);
    }
}
