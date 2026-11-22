<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Profiles\Values\ProfileKey;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The profile a reader shows, named by its key in the route.
 */
final class ProfilePageRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function key(): ProfileKey
    {
        return ProfileKey::from((string) $this->route('profile'));
    }
}
