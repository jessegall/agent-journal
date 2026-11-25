<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelAccessors;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use ArrayObject;
use RuntimeException;

/**
 * A model with one answer that belongs in an accessor, accessors that write, throw, turn off object caching or give an
 * object, and the answers that stay methods: a question, an answer that names what it throws and an answer that types its own column.
 *
 * @property string $title
 * @property string $state
 */
final class AnswersAndAccessors extends Model
{
    // ----------[ Predicates ]----------

    public function isDone(): bool
    {
        return $this->state === 'done';
    }

    // ----------[ Transformers ]----------

    public function heading(): string
    {
        return "Task {$this->title}";
    }

    /**
     * @throws RuntimeException when the row has no title
     */
    public function requiredTitle(): string
    {
        return $this->title !== '' ? $this->title : throw new RuntimeException('No title.');
    }

    public function state(): string
    {
        return strtoupper($this->state);
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<string, never>
     */
    protected function savedTitle(): Attribute
    {
        return Attribute::get(function (): string {
            $this->save();

            return $this->title;
        });
    }

    /**
     * @return Attribute<ArrayObject<int, string>, never>
     */
    protected function words(): Attribute
    {
        return Attribute::get(fn () => new ArrayObject(explode(' ', $this->title)));
    }

    /**
     * @return Attribute<string, never>
     */
    protected function checkedTitle(): Attribute
    {
        return Attribute::get(function (): string {
            if ($this->title === '') {
                throw new RuntimeException('No title.');
            }

            return $this->title;
        });
    }

    /**
     * @return Attribute<string, never>
     */
    protected function shoutedTitle(): Attribute
    {
        return Attribute::get(fn (): string => strtoupper($this->title))->withoutObjectCaching();
    }
}
