<?php

declare(strict_types=1);

namespace App\Samples;

/**
 * A first or find whose missing answer is thrown on the spot, which the first-or-throw rule finds, beside the reads
 * that fail by their own name, which it passes.
 */
final class FirstOrThrowSamples
{
    public function sinful(SampleShelf $shelf): SampleBook
    {
        // @sin FirstOrThrowDetector
        return $shelf->first() ?? throw SampleBookMissing::onShelf();
    }

    public function sinfulFind(SampleShelf $shelf, string $title): SampleBook
    {
        // @sin FirstOrThrowDetector
        return $shelf->find($title) ?? throw SampleBookMissing::onShelf();
    }

    public function righteous(SampleShelf $shelf): SampleBook
    {
        // @righteous FirstOrThrowDetector
        return $shelf->firstOrFail();
    }

    public function righteousFallback(SampleShelf $shelf): SampleBook
    {
        // @righteous FirstOrThrowDetector
        return $shelf->first() ?? SampleBook::blank();
    }
}

final class SampleShelf
{
    public function first(): ?SampleBook
    {
        return null;
    }

    public function find(string $title): ?SampleBook
    {
        return null;
    }

    public function firstOrFail(): SampleBook
    {
        return SampleBook::blank();
    }
}

final class SampleBook
{
    public static function blank(): self
    {
        return new self;
    }
}

final class SampleBookMissing extends \RuntimeException
{
    public static function onShelf(): self
    {
        return new self;
    }
}
