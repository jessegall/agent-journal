<?php

declare(strict_types=1);

namespace App\Web;

use App\Access\Contracts\SharePolicy;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentUserResolver;
use App\Actors\CurrentUser;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Contracts\InstalledVersion;
use App\Agents\Drivers\Data\DriverLookData;
use App\Bus\Contracts\CommandRefusal;
use App\Hosts\HostLinkAlarms;
use App\Navigation\Contracts\NavigationRecords;
use App\Projects\Contracts\CurrentProject;
use App\Projects\Contracts\ProjectDirectory;
use App\Projects\Data\ProjectData;
use App\Projects\Enums\ProjectSelectionType;
use App\Settings\Contracts\SettingsResolver;
use App\Settings\CoreSettings;
use App\Support\ActorReference;
use App\Values\DriverFamily;
use App\Values\InboxMemberAuthority;
use App\Web\Data\AppContextData;
use App\Web\Data\InstallationData;
use App\Web\Data\ViewerData;
use App\Web\Enums\ViewerType;
use App\Web\Values\LiveListeners;
use Illuminate\Http\Request;
use PhpOption\Option;
use Spatie\LaravelData\Optional;

/**
 * The app context of one request, by who views it: a guest sees the installation's name and version, the owner its
 * faults, the driver looks, the navigation and the projects, and an inbox member the driver looks and the navigation.
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
        private ProjectDirectory $projects,
        private CurrentProject $selection,
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
                ->getOrElse(Optional::create()),
            // An inbox member is shown no journal counts: it sees only the inboxes it is in.
            'navigationCounts' => $user
                ->filter(fn () => $type === ViewerType::Owner)
                ->map(fn (CurrentUser $signedIn) => ContextLazy::deferredLive(
                    fn () => $this->navigation->counts(),
                    self::COUNTS_GROUP,
                    LiveListeners::pageChanges($signedIn->id),
                ))
                ->getOrElse(Optional::create()),
            ...$this->projectChoice($type),
        ]);
    }

    /**
     * The projects the owner may choose and the one chosen, null for All projects; no one else chooses.
     *
     * @return array{projects?: list<ProjectData>, selectedProject?: string|null}
     */
    private function projectChoice(ViewerType $type): array
    {
        if ($type !== ViewerType::Owner) {
            return [];
        }

        $selection = $this->selection->selection();

        return [
            'projects' => $this->projects->listed(),
            'selectedProject' => $selection->type === ProjectSelectionType::Project ? $selection->projectId() : null,
        ];
    }

    /**
     * No one signed in is a guest; a signed-in user is an inbox member when its sign-in gave it the inbox-only
     * authority, and the owner otherwise.
     *
     * @param  Option<CurrentUser>  $user
     */
    private function viewerType(Option $user): ViewerType
    {
        return match (true) {
            $user->isEmpty() => ViewerType::Guest,
            $this->actors->hasActor() && $this->actors->authority() instanceof InboxMemberAuthority => ViewerType::InboxMember,
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
            'id' => $user->map(fn (CurrentUser $signedIn) => $signedIn->id)->getOrElse(Optional::create()),
            'name' => $user->map(fn (CurrentUser $signedIn) => $signedIn->name)->getOrElse(Optional::create()),
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
        return array_map(
            fn (DriverFamily $family) => DriverLookData::fromDriverFamily($family),
            $this->drivers->families(),
        );
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
                ? [
                    ...$this->installationFaults->current(),
                    ...$this->hostLinkAlarms->current(),
                ]
                : [],
        ]);
    }

    /**
     * The stable code of the refusal the last form was answered with, when it was refused.
     */
    private function refusalCodeOf(Request $request): string|Optional
    {
        $code = $request->session()->get(CommandRefusal::CODE_FLASH_KEY);

        if (is_string($code)) {
            return $code;
        }

        return Optional::create();
    }
}
