<?php

declare(strict_types=1);

namespace App\Reads;

use App\Exceptions\ReadLimitInvalid;
use Illuminate\Container\Attributes\Config;

/**
 * The configured bounds of a read: how many rows a page shows unasked, and the most rows a page holds.
 */
final readonly class ReadSettings
{
    public function __construct(
        #[Config('journal.reads.default_limit')]
        public int $defaultLimit,
        #[Config('journal.reads.page_max')]
        public int $pageMax,
    ) {}

    /**
     * @throws ReadLimitInvalid
     */
    public function assertValid(): void
    {
        if ($this->defaultLimit < 1 || $this->defaultLimit > $this->pageMax) {
            throw ReadLimitInvalid::configured($this->defaultLimit, $this->pageMax);
        }
    }
}
