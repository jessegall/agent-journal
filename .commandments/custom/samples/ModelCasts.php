<?php

declare(strict_types=1);

namespace Samples;

use Illuminate\Database\Eloquent\Model;

final class CastsFirst extends Model
{
    public const string LINK_TYPE = 'samples.first';

    /**
     * @return array<string, string>
     */
    // @righteous ModelCastsBelowAttributesDetector
    protected function casts(): array
    {
        return ['id' => 'integer'];
    }

    public function label(): string
    {
        return 'first';
    }
}

final class CastsLast extends Model
{
    public function label(): string
    {
        return 'last';
    }

    /**
     * @return array<string, string>
     */
    // @sin ModelCastsBelowAttributesDetector
    protected function casts(): array
    {
        return ['id' => 'integer'];
    }
}

final class NotAModel
{
    public function label(): string
    {
        return 'value';
    }

    /**
     * @return array<string, string>
     */
    // @righteous ModelCastsBelowAttributesDetector
    public function casts(): array
    {
        return [];
    }
}
