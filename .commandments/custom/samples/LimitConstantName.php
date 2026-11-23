<?php

declare(strict_types=1);

namespace App\Samples;

/**
 * Constants that hold a most or a least, which the limit-constant-name rule finds when their name does not say limit,
 * beside the same constants named as limits, which it passes.
 */
final class LimitConstantNameSamples
{
    /** The most characters a title holds. */
    // @sin LimitConstantNameDetector
    public const int TITLE_CHARACTERS = 120;

    // @sin LimitConstantNameDetector
    public const int RETRIES = SampleLimit::Retries->value;

    /** The most characters a title holds. */
    // @righteous LimitConstantNameDetector
    public const int TITLE_CHARACTER_LIMIT = 120;

    // @righteous LimitConstantNameDetector
    public const int RETRY_LIMIT = SampleLimit::Retries->value;

    /** The name a sample shows. */
    // @righteous LimitConstantNameDetector
    public const string LABEL = 'sample';
}

enum SampleLimit: int
{
    case Retries = 3;
}
