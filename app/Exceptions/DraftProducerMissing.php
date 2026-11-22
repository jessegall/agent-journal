<?php

declare(strict_types=1);

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A guided draft was asked for a noun that has no registered producer.
 */
final class DraftProducerMissing extends NotFoundHttpException
{
    public static function forNoun(string $noun): self
    {
        return new self("No draft producer is registered for {$noun}.");
    }
}
