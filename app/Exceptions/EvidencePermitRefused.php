<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * An evidence permit cannot be issued or used.
 */
final class EvidencePermitRefused extends RuntimeException
{
    public static function required(): self
    {
        return new self('An evidence permit is required: a project owner issues one for the exact command line.');
    }

    public static function unknown(): self
    {
        return new self('A command line that is not completely known cannot get an evidence permit.');
    }

    public static function beyondRole(): self
    {
        return new self('The command line needs effects beyond what the runner may do.');
    }

    public static function consumed(): self
    {
        return new self('This evidence permit was already used.');
    }

    public static function expired(): self
    {
        return new self('This evidence permit has expired.');
    }

    public static function otherActor(): self
    {
        return new self('This evidence permit was issued for another actor.');
    }

    public static function changed(): self
    {
        return new self('The command line now reads or classifies differently than when the permit was issued.');
    }
}
