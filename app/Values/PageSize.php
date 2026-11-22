<?php

declare(strict_types=1);

namespace App\Values;

use Illuminate\Container\Container;
use Illuminate\Validation\ValidationException;

/**
 * The number of rows a list page shows: 50 unless asked, never above reads.page_max, refused before any query.
 */
final readonly class PageSize
{
    private function __construct(public int $rows) {}

    /**
     * @throws ValidationException
     */
    public static function from(int|null $rows): self
    {
        $config = Container::getInstance()->make('config');
        $requested = $rows ?? $config->integer('reads.default_limit');
        $maximum = $config->integer('reads.page_max');

        if ($requested < 1 || $requested > $maximum) {
            throw ValidationException::withMessages(
                ['per_page' => "A page shows 1 to {$maximum} rows, not {$requested}."],
            );
        }

        return new self($requested);
    }
}
