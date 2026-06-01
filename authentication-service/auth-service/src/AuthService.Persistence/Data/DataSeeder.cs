using AuthService.Domain.Entities;
using AuthService.Application.Services;
using AuthService.Domain.Constants;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (!(context.Roles?.Any() ?? false))
        {
            var roles = new List<Role>
            {
                new()
                {
                    Id = UuidGenerator.GenerateRoleId(),
                    Name = RoleConstants.ADMIN_ROLE
                },
                new()
                {
                    Id = UuidGenerator.GenerateRoleId(),
                    Name = RoleConstants.USER_ROLE
                }
            };

            await context.Roles!.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }

        var adminEmail = "admin@ksports.local";
        var adminUsername = "admin";
        var adminPassword = new PasswordHashService().HashPassword("Admin1234!");

        var adminRole = await (context.Roles ?? throw new InvalidOperationException("Roles DbSet is null."))
            .FirstOrDefaultAsync(r => r.Name == RoleConstants.ADMIN_ROLE);

        if (adminRole == null)
        {
            return;
        }

        var users = context.Users ?? throw new InvalidOperationException("Users DbSet is null.");
        var userEmails = context.UserEmails ?? throw new InvalidOperationException("UserEmails DbSet is null.");
        var passwordResets = context.UserPasswordResets ?? throw new InvalidOperationException("UserPasswordResets DbSet is null.");
        var userRoles = context.UserRoles ?? throw new InvalidOperationException("UserRoles DbSet is null.");

        var adminUser = await users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == adminEmail || u.Username == adminUsername);

        if (adminUser == null)
        {
            var userId = UuidGenerator.GenerateUserId();

            adminUser = new User
            {
                Id = userId,
                Name = "Admin",
                Surname = "User",
                Username = adminUsername,
                Email = adminEmail,
                Password = adminPassword,
                Status = true,
                UserProfile = new UserProfile
                {
                    Id = UuidGenerator.GenerateUserId(),
                    UserId = userId,
                    ProfilePicture = string.Empty,
                    Phone = string.Empty
                },
                UserEmail = new UserEmail
                {
                    Id = UuidGenerator.GenerateUserId(),
                    UserId = userId,
                    EmailVerified = true,
                    EmailVerificationToken = null,
                    EmailVerificationTokenExpiry = null
                },
                UserPasswordReset = new UserPasswordReset
                {
                    Id = UuidGenerator.GenerateUserId(),
                    UserId = userId,
                    PasswordResetToken = null,
                    PasswordResetTokenExpiry = null
                },
                UserRoles =
                [
                    new UserRole
                    {
                        Id = UuidGenerator.GenerateUserId(),
                        UserId = userId,
                        RoleId = adminRole.Id
                    }
                ]
            };

            await users.AddAsync(adminUser);
            await context.SaveChangesAsync();
            return;
        }

        await users
            .Where(u => u.Id == adminUser.Id)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(u => u.Email, adminEmail)
                .SetProperty(u => u.Username, adminUsername)
                .SetProperty(u => u.Password, adminPassword)
                .SetProperty(u => u.Status, true)
                .SetProperty(u => u.UpdatedAt, DateTime.UtcNow));

        var adminEmailRecord = await userEmails.FirstOrDefaultAsync(ue => ue.UserId == adminUser.Id);
        if (adminEmailRecord == null)
        {
            await userEmails.AddAsync(new UserEmail
            {
                Id = UuidGenerator.GenerateUserId(),
                UserId = adminUser.Id,
                EmailVerified = true,
                EmailVerificationToken = null,
                EmailVerificationTokenExpiry = null
            });
        }
        else
        {
            await userEmails
                .Where(ue => ue.UserId == adminUser.Id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(ue => ue.EmailVerified, true)
                    .SetProperty(ue => ue.EmailVerificationToken, (string?)null)
                    .SetProperty(ue => ue.EmailVerificationTokenExpiry, (DateTime?)null));
        }

        if (!await passwordResets.AnyAsync(pr => pr.UserId == adminUser.Id))
        {
            await passwordResets.AddAsync(new UserPasswordReset
            {
                Id = UuidGenerator.GenerateUserId(),
                UserId = adminUser.Id,
                PasswordResetToken = null,
                PasswordResetTokenExpiry = null
            });
        }

        if (!await userRoles.AnyAsync(ur => ur.UserId == adminUser.Id && ur.RoleId == adminRole.Id))
        {
            await userRoles.AddAsync(new UserRole
            {
                Id = UuidGenerator.GenerateUserId(),
                UserId = adminUser.Id,
                RoleId = adminRole.Id
            });
        }

        await context.SaveChangesAsync();
    }
}
