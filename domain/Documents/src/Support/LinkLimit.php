<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use Domain\Documents\Exceptions\ContentTooLarge;

/**
 * How many records one write may link to.
 */
final class LinkLimit
{
    /**
     * @param  list<mixed>  $links
     *
     * @throws ContentTooLarge
     */
    public static function require(array $links, int $most): void
    {
        if (count($links) > $most) {
            throw ContentTooLarge::field('about', "{$most} links");
        }
    }
}
