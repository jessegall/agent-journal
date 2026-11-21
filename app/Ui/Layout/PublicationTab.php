<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use Closure;

/**
 * One tab of a publication: its key, its label, and the reader of its content, called only when the tab is shown.
 */
final readonly class PublicationTab
{
    /**
     * @param  Closure(): LayoutPartData  $read
     */
    private function __construct(
        public string $key,
        public string $label,
        public Closure $read,
    ) {}

    /**
     * @param  Closure(): LayoutPartData  $read
     */
    public static function deferred(string $key, string $label, Closure $read): self
    {
        return new self($key, $label, $read);
    }
}
