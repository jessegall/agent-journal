<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Http\Requests\Sharing\Concerns\ReadsShareId;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The share the owner's detail page or reveal action names.
 */
final class ShareRequest extends FormRequest
{
    use ReadsShareId;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }
}
