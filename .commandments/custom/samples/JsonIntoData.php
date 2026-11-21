<?php

declare(strict_types=1);

namespace App\Samples;

use Spatie\LaravelData\Data;

/**
 * A decoded JSON read as a loose array, which the json-into-data rule finds, beside one read straight into a Data
 * class, which it passes.
 */
final class JsonIntoData
{
    /**
     * @return array<array-key, mixed>
     */
    public function loose(string $json): array
    {
        // @sin JsonIntoDataDetector
        return (array) json_decode($json, true, 512, JSON_THROW_ON_ERROR);
    }

    public function typed(string $json): SampleRecord
    {
        // @righteous JsonIntoDataDetector
        return SampleRecord::from(json_decode($json, true, 512, JSON_THROW_ON_ERROR));
    }
}

/**
 * The shape of the sample's record.
 */
final class SampleRecord extends Data
{
    public function __construct(public readonly string $name) {}
}
