<?php

declare(strict_types=1);

namespace App\Http\Pages\Profiles;

use App\Models\Profiles\Profile;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;
use Spatie\LaravelData\Optional;

/**
 * The profiles as the shared list recipe, as the design draws it: each profile by its label with its one-line description
 * beneath, its reader beside it, and an informational empty state when there are none. Only the key, label and
 * description are read for the list.
 */
final readonly class ProfilesIndex extends ProfilesPage
{
    private const int ROWS = 100;

    /**
     * @param  list<LayoutPartData>  $reader  the opened profile's reader, none for the index address
     */
    public function of(string $selectedKey, array $reader): DeclaredLayoutData
    {
        $profiles = Profile::findListed(self::ROWS);

        return ListPage::make(
            'Profiles',
            array_map(fn (Profile $profile) => LayoutRowData::from([
                'key' => $profile->id,
                'label' => $profile->label,
                'detail' => $profile->description === '' ? Optional::create() : $profile->description,
                'href' => route('accounts.profile', ['profile' => $profile->key], false),
                'isCurrent' => $profile->key === $selectedKey,
            ]), $profiles),
            ListEmpty::nothingYet(
                'No profiles yet',
                'A profile is a kind of helper: the program it runs, its models, its rules and whom it answers to.',
                'users',
            ),
        )
            ->countingRows()
            ->withReader(
                LayoutBackData::from(['href' => route('accounts.profiles', [], false), 'label' => 'Profiles']),
                ...$reader,
            )
            ->layout();
    }
}
