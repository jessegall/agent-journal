<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelAccessors;

use App\Models\Support\Accessor;
use ArrayObject;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use RuntimeException;

/**
 * A model with two answers that belong in an accessor (a text and an object), accessors that write, throw, call
 * withoutObjectCaching or are built with Laravel's Attribute, an object accessor that is fine, and the answers that
 * stay methods: a question, an answer that names what it throws and an answer that types its own column.
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

    /**
     * @return ArrayObject<int, string>
     */
    public function titleWords(): ArrayObject
    {
        return new ArrayObject(explode(' ', $this->title));
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<string, never>
     */
    protected function savedTitle(): Attribute
    {
        return Accessor::get(function (): string {
            $this->save();

            return $this->title;
        });
    }

    /**
     * @return Attribute<ArrayObject<int, string>, never>
     */
    protected function words(): Attribute
    {
        return Accessor::get(fn () => new ArrayObject(explode(' ', $this->title)));
    }

    /**
     * @return Attribute<string, never>
     */
    protected function checkedTitle(): Attribute
    {
        return Accessor::get(function (): string {
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
        return Accessor::get(fn (): string => strtoupper($this->title))->withoutObjectCaching();
    }

    /**
     * @return Attribute<string, never>
     */
    protected function plainTitle(): Attribute
    {
        return Attribute::get(fn (): string => $this->title);
    }
}
