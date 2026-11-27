<?php

declare(strict_types=1);

namespace App\Reads\Values;

use App\Reads\ReadSettings;
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
        $settings = Container::getInstance()->make(ReadSettings::class);
        $requested = $rows ?? $settings->defaultLimit;
        $maximum = $settings->pageMax;

        if ($requested < 1 || $requested > $maximum) {
            throw ValidationException::withMessages(
                ['per_page' => "A page shows 1 to {$maximum} rows, not {$requested}."],
            );
        }

        return new self($requested);
    }
}
