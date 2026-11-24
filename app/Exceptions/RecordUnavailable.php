<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use App\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Model;
use RuntimeException;

final class RecordUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(RecordIdentity $record): self
    {
        return new self("{$record->type} {$record->id} does not exist or cannot be assigned by you.");
    }

    /**
     * A record that is missing or that the actor may not read or change, worded the same either way.
     */
    public static function forActor(RecordIdentity $record): self
    {
        return new self("{$record->type} {$record->id} does not exist or is not available to you.");
    }

    /**
     * A row a model could not find for the actor, answered as unavailable like forActor.
     */
    public static function forMissing(ModelMissing $missing): self
    {
        return self::forModel($missing->model, $missing->id);
    }

    /**
     * A row of the model that is missing or hidden from the actor, worded like forActor.
     *
     * @param  class-string<Model>  $model
     */
    public static function forModel(string $model, string $id): self
    {
        return new self(class_basename($model)." {$id} does not exist or is not available to you.");
    }

    /**
     * A record named by its number that is missing or not available to the actor, worded like forActor.
     */
    public static function numbered(string $word, int $number): self
    {
        return new self("{$word} {$number} does not exist or is not available to you.");
    }

    protected function status(): int
    {
        return 404;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
