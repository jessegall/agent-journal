<?php

declare(strict_types=1);

namespace App\Models\Access;

use App\Actors\Contracts\RecipientActor;
use App\Asks\Contracts\QuestionRecipient;
use App\Assignments\Contracts\Assignee;
use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Concerns\TakesPartInMessages;
use App\Messages\Contracts\MessageReceiver;
use App\Messages\Contracts\MessageSender;
use App\Models\Inboxes\InboxMember;
use App\Models\Support\HasUlidKey;
use App\Records\Contracts\ReadableModel;
use App\Support\AssigneeIdentity;
use Carbon\CarbonImmutable;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\DatabaseNotificationCollection;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Override;

/**
 * @property string $id
 * @property string $name
 * @property string $email
 * @property CarbonImmutable|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property CarbonImmutable|null $two_factor_confirmed_at
 * @property CarbonImmutable|null $disabled_at
 * @property string|null $remember_token
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Collection<int, InboxMember> $inboxMemberships
 * @property-read int|null $inbox_memberships_count
 * @property-read DatabaseNotificationCollection<int, DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read Collection<int, Passkey> $passkeys
 * @property-read int|null $passkeys_count
 *
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 *
 * @mixin \Eloquent
 */
#[UseFactory(UserFactory::class)]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements
    Assignee,
    MessageReceiver,
    MessageSender,
    MustVerifyEmail,
    PasskeyUser,
    QuestionRecipient,
    ReadableModel,
    RecipientActor
{
    use BoundedReads;

    /**
     * @use HasFactory<UserFactory>
     */
    use HasFactory;

    use HasUlidKey;
    use InsertsAbsentRows;
    use Linkable;
    use Notifiable;
    use PasskeyAuthenticatable;
    use TakesPartInMessages;
    use TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'disabled_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new user with a name, an email and a password the hashed cast hashes.
     */
    public static function create(string $name, string $email, string $password): self
    {
        $user = new self();
        $user->name = $name;
        $user->email = $email;
        $user->password = $password;
        $user->save();

        return $user;
    }

    /**
     * The installation's owner account, made the first time and found by its email after that.
     */
    public static function createForInstallation(string $name, string $email, string $password): self
    {
        $owner = new self();
        $owner->name = $name;
        $owner->email = $email;
        $owner->password = $password;
        $owner->setAttribute($owner->getKeyName(), $owner->newUniqueId());

        // The inserted row is returned as it is, so its caller sees wasRecentlyCreated; an owner already there is read.
        if ($owner->insertIfAbsent()) {
            return $owner;
        }

        return self::findWithEmail($email);
    }

    // ----------[ Mutations ]----------

    /**
     * Disables the account: it is never admitted again until it is enabled.
     */
    public function disable(CarbonImmutable $at): void
    {
        $this->disabled_at = $at;
        $this->save();
    }

    public function enable(): void
    {
        $this->disabled_at = null;
        $this->save();
    }

    /**
     * Stores a new password; the hashed cast hashes it.
     */
    public function changePassword(string $password): void
    {
        $this->password = $password;
        $this->save();
    }

    // ----------[ Predicates ]----------

    public function isDisabled(): bool
    {
        return $this->disabled_at !== null;
    }

    // ----------[ Transformers ]----------

    public function assigneeIdentity(): AssigneeIdentity
    {
        return AssigneeIdentity::of($this);
    }

    // ----------[ Calculations ]----------

    public function actorType(): string
    {
        return self::storedType();
    }

    public function actorId(): string
    {
        return $this->id;
    }

    // ----------[ Queries ]----------

    #[Override]
    public static function storedType(): string
    {
        return 'user';
    }

    /**
     * The id of the user with this email address, the journal's owner; none when no such user exists yet.
     */
    public static function resolveOwnerIdFor(string $email): string|null
    {
        $id = self::query()->withEmail($email)->value('id');

        if (is_string($id)) {
            return $id;
        }

        return null;
    }

    /**
     * The user with this email; a missing one fails the read.
     */
    public static function findWithEmail(string $email): self
    {
        return self::query()->withEmail($email)->sole();
    }

    // ----------[ Scopes ]----------

    /**
     * The user of that email address.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withEmail(Builder $query, string $email): void
    {
        $query->where('email', $email);
    }
}
