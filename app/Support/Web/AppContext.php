<?php

declare(strict_types=1);

namespace App\Support\Web;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Actors\CurrentUserResolver;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Drivers\InstalledVersion;
use App\Contracts\Navigation\NavigationRecords;
use App\Contracts\Settings\SettingsResolver;
use App\Contracts\Sharing\SharePolicy;
use App\Data\Drivers\DriverLookData;
use App\Data\Web\AppContextData;
use App\Data\Web\InstallationData;
use App\Data\Web\ViewerData;
use App\Enums\Web\ViewerType;
use App\Support\ActorReference;
use App\Support\CoreSettings;
use App\Support\CurrentUser;
use App\Support\HostLinkAlarms;
use App\Support\InstallationFaults;
use App\Values\InboxMemberAuthority;
use App\Values\Web\LiveListeners;
use Illuminate\Http\Request;
use PhpOption\Option;
use Spatie\LaravelData\Optional;

/**
 * The app context of one request, read from who views it: a guest sees the installation's name and version, the owner
 * its faults, the driver looks, the navigation and its counts, and an inbox member the driver looks and the navigation.
 * It holds nothing between requests.
 */
final readonly class AppContext
{
    private const string COUNTS_GROUP = 'navigation-counts';

    public function __construct(
        private SettingsResolver $settings,
        private CoreSettings $core,
        private CurrentUserResolver $users,
        private CurrentActor $actors,
        private NavigationRecords $navigation,
        private SharePolicy $sharing,
        private InstalledVersion $version,
        private InstallationFaults $installationFaults,
        private HostLinkAlarms $hostLinkAlarms,
        private DriverCatalogue $drivers,
    ) {}

    public function data(Request $request): AppContextData
    {
        $user = $this->users->currentUser();
        $type = $this->viewerType($user);

        return AppContextData::from([
            'installation' => ContextLazy::value(fn () => $this->installation($type)),
            'viewer' => ContextLazy::always(fn () => $this->viewer($user, $type)),
            'drivers' => ContextLazy::value(fn () => $type === ViewerType::Guest ? [] : $this->driverLooks()),
            'refusalCode' => $this->refusalCodeOf($request),
            'navigation' => $user
                ->map(fn (CurrentUser $signedIn) => ContextLazy::live(
                    fn () => $this->navigation->tree($request),
                    LiveListeners::pageChanges($signedIn->id),
                ))
                ->getOrElse(new Optional()),
            // An inbox member is shown no journal counts: it sees only the inboxes it is in.
            'navigationCounts' => $user
                ->filter(fn () => $type === ViewerType::Owner)
                ->map(fn (CurrentUser $signedIn) => ContextLazy::deferredLive(
                    fn () => $this->navigation->counts(),
                    self::COUNTS_GROUP,
                    LiveListeners::pageChanges($signedIn->id),
                ))
                ->getOrElse(new Optional()),
        ]);
    }

    /**
     * No one signed in is a guest; a signed-in user is an inbox member when its sign-in gave it the chat-only
     * authority, and the owner otherwise.
     *
     * @param  Option<CurrentUser>  $user
     */
    private function viewerType(Option $user): ViewerType
    {
        return match (true) {
            $user->isEmpty() => ViewerType::Guest,
            $this->actors->hasActor() && $this->actors->authority() instanceof InboxMemberAuthority
                => ViewerType::InboxMember,
            default => ViewerType::Owner,
        };
    }

    /**
     * @param  Option<CurrentUser>  $user
     */
    private function viewer(Option $user, ViewerType $type): ViewerData
    {
        return ViewerData::from([
            'type' => $type,
            'id' => $user->map(fn (CurrentUser $signedIn) => $signedIn->id)->getOrElse(new Optional()),
            'name' => $user->map(fn (CurrentUser $signedIn) => $signedIn->name)->getOrElse(new Optional()),
            'canShare' => $user
                ->map(fn (CurrentUser $signedIn) => $this->sharing->mayManage(ActorReference::forUser($signedIn->id)))
                ->getOrElse(false),
        ]);
    }

    /**
     * How each registered driver family is shown.
     *
     * @return list<DriverLookData>
     */
    private function driverLooks(): array
    {
        return DriverLookData::collect($this->drivers->families());
    }

    /**
     * What the installation could not heal is the owner's alone to see.
     */
    private function installation(ViewerType $type): InstallationData
    {
        return InstallationData::from([
            'name' => $this->settings->string($this->core->displayName),
            'version' => $this->version->label(),
            'faults' => $type === ViewerType::Owner
                ? [...$this->installationFaults->current(), ...$this->hostLinkAlarms->current()]
                : [],
        ]);
    }

    /**
     * The stable code of the refusal the last form was answered with, when it was refused.
     */
    private function refusalCodeOf(Request $request): string|Optional
    {
        $code = $request->session()->get(CommandRefusal::CODE_FLASH_KEY);

        return is_string($code) ? $code : new Optional();
    }
}
