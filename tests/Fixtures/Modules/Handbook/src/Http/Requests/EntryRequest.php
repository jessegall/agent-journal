<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Handbook\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Tests\Fixtures\Modules\Handbook\Exceptions\HandbookEntryMissing;

/**
 * The visit to a handbook entry: its number from the route, the tab and the references cursor from its window's query.
 */
final class EntryRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'tab' => ['nullable', 'string', 'max:40'],
            'cursor' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function entryNumber(): int
    {
        $number = (string) $this->route('entry');

        if (preg_match('/^[1-9][0-9]{0,9}$/', $number) !== 1) {
            throw HandbookEntryMissing::forNumber($number);
        }

        return (int) $number;
    }

    /**
     * The tab the window chose; none chooses the page's first.
     */
    public function chosenTab(): string
    {
        return $this->string('tab')->toString();
    }

    /**
     * Where the page of references starts; 0 for the first page.
     */
    public function cursor(): int
    {
        return $this->integer('cursor');
    }
}
