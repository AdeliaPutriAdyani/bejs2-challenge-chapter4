const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () { 
  const int = Number.parseInt(this.toString()); 
  return int ?? this.toString(); 
};

module.exports = {
  registerAccount: async (req, res) => {
    try {
      const { user_id, bank_name, bank_account_number, balance } = req.body;
      const userId = parseInt(user_id);
  
      const user = await prisma.users.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return res.status(404).json({
          error: 'USER ID TIDAK DITEMUKAN',
        });
      }
  
      const account = await prisma.bank_accounts.create({
        data: {
          bank_name,
          bank_account_number, 
          balance: BigInt(balance),
          user: {
            connect: { id: userId },
          },
        },
      });
  
      return res.json({
        data: account,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Gagal Memasukkan Data Bank Account',
      });
    }
  },  
  

  getAccount: async (req, res) => {
    const accounts = await prisma.bank_accounts.findMany();
  
    return res.json({
      data: accounts,
    });
  },

  getAccountId: async (req, res) => {
    const accountId = parseInt(req.params.accountId);
    const account = await prisma.bank_accounts.findUnique({
      where: {
        id: accountId
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });
    
    return res.json({
      data: account
    });
  } 
}