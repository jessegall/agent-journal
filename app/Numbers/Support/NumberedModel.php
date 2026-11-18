<?php

declare(strict_types=1);

namespace App\Numbers\Support;

use App\Numbers\Models\GlobalGroup;
use Illuminate\Database\Eloquent\Model;

/**
 * One model an owner numbers, with the model it is numbered within: the journal for a global number, a parent such
 * as a plan for a scoped one.
 */
final readonly class NumberedModel
{
    /**
     * @param  class-string<Model>  $model
     * @param  class-string<Model>  $holder
     */
    private function __construct(public string $model, public string $holder) {}

    /**
     * A model numbered across the whole journal, like task 12.
     *
     * @param  class-string<Model>  $model
     */
    public static function global(string $model): self
    {
        return new self($model, GlobalGroup::class);
    }

    /**
     * A model numbered within each of its parents, like phase 2 of a plan.
     *
     * @param  class-string<Model>  $model
     * @param  class-string<Model>  $holder
     */
    public static function within(string $model, string $holder): self
    {
        return new self($model, $holder);
    }
}
