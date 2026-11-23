<?php

declare(strict_types=1);

namespace App\Http\Pages\Profiles;

use App\Models\Profile;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;

/**
 * The profiles as the shared list recipe: each profile by its label with its key beneath and a Retired badge when new
 * starts may no longer choose it, its reader beside it, and an informational empty state when there are none. Only the
 * key, label and state are read for the list.
 */
final readonly class ProfilesIndex
{
    private const int ROWS = 100;

    /**
     * @param  list<LayoutPartData>  $reader  the opened profile's reader, none for the index address
     */
    public function of(string $selectedKey, array $reader): DeclaredLayoutData
    {
        $profiles = Profile::listed(self::ROWS);

        return ListPage::make(
            'Profiles',
            array_map(fn (Profile $profile) => new LayoutRowData(
                $profile->id,
                $profile->label,
                detail: $profile->description === '' ? $profile->key : $profile->description,
                href: route('accounts.profile', ['profile' => $profile->key], false),
                isCurrent: $profile->key === $selectedKey,
                trailing: $profile->isRetired() ? [LayoutPartData::badge('state', 'Retired', 'quiet')] : [],
            ), $profiles),
            ListEmpty::informing('No profiles yet.', 'Profiles appear here once an owner activates them.'),
        )
            ->counting(count($profiles))
            ->withReader(new LayoutBackData(route('accounts.profiles', [], false), 'Profiles'), ...$reader)
            ->layout();
    }
}
