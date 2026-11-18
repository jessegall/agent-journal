<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

/**
 * Which helper images the image build verified and recorded by digest.
 */
interface HelperImages
{
    public function isVerified(string $imageReference): bool;
}
