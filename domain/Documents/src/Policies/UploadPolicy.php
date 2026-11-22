<?php

declare(strict_types=1);

namespace Domain\Documents\Policies;

use App\Contracts\Policy;
use Domain\Documents\Models\TextUpload;

/**
 * Who may act on TextUpload records; the grant decides, and the handlers keep their own checks.
 */
final readonly class UploadPolicy implements Policy
{
    public static function model(): string
    {
        return TextUpload::class;
    }
}
