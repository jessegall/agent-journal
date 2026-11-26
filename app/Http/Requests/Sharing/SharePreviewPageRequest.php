<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Http\Requests\Sharing\Concerns\ReadsShareRoot;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The root record the owner's share preview page shows, from its route.
 */
final class SharePreviewPageRequest extends FormRequest
{
    use ReadsShareRoot;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }
}
