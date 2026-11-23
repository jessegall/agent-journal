<?php

declare(strict_types=1);

namespace App\Http\Requests\Connections;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The Project window's own query: the folders the user opened in the tree, by their paths from the project's root.
 */
final class ProjectWindowRequest extends FormRequest
{
    /**
     * The most opened folders one view reads; the rest stay closed.
     */
    public const int OPEN_FOLDER_LIMIT = 20;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'open' => ['sometimes', 'array'],
            'open.*' => ['string', 'max:1024'],
        ];
    }

    /**
     * The opened folders' paths, each once, the first OPEN_FOLDER_LIMIT of them.
     *
     * @return list<string>
     */
    public function openFolders(): array
    {
        $open = array_values(array_unique(array_map(strval(...), $this->array('open'))));

        return array_slice($open, 0, self::OPEN_FOLDER_LIMIT);
    }
}
